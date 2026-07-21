<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — contact form handler
 *  Receives a POST from the site contact forms and emails the lead.
 *
 *  Same delivery model as maximapools.com: mail() through Hostinger,
 *  envelope sender on the domain (`-f`) so SPF aligns. Every submission
 *  is also appended to /.private/submissions.log so the lead survives
 *  a broken email layer.
 * ---------------------------------------------------------------------- */

// === Configuration ====================================================
$RECIPIENT  = 'info@maximaconcrete.com';
$FROM_NAME  = 'Maxima Concrete Website';
$FROM_EMAIL = 'no-reply@maximaconcrete.com';
// ======================================================================

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (
    $origin === '' ||
    preg_match('#^https?://(www\.)?maximaconcrete\.com$#i', $origin) ||
    preg_match('#^http://localhost(:\d+)?$#i', $origin)
) {
    if ($origin !== '') {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    }
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

function clean_line(string $v): string {
    $v = trim($v);
    return str_replace(["\r", "\n", "%0a", "%0d"], '', $v);
}
function field(string $k): string {
    return clean_line((string)($_POST[$k] ?? ''));
}

function log_submission(array $entry): void {
    $dir = __DIR__ . '/../.private';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
    @file_put_contents($dir . '/submissions.log', $line, FILE_APPEND | LOCK_EX);
}

/**
 * Handles a résumé submission from the Join Our Team page. Emails info@ with a
 * distinct subject and the uploaded file as an attachment (multipart/mixed).
 */
function handle_resume(string $recipient, string $fromName, string $fromEmail): void {
    $name     = clean_line((string)($_POST['name'] ?? ''));
    $email    = clean_line((string)($_POST['email'] ?? ''));
    $phone    = clean_line((string)($_POST['phone'] ?? ''));
    $position = clean_line((string)($_POST['position'] ?? ''));
    $msg      = substr(trim((string)($_POST['message'] ?? '')), 0, 5000);

    $errors = [];
    if (strlen($name) < 2) $errors['name'] = 'Please enter your name';
    $hasPhone = strlen(preg_replace('/\D/', '', $phone)) >= 10;
    $hasEmail = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    if (!$hasPhone && !$hasEmail) $errors['contact'] = 'Please enter a valid phone number or email';
    if ($errors) { http_response_code(400); echo json_encode(['ok' => false, 'errors' => $errors]); return; }

    // Uploaded résumé (optional but expected).
    $attachData = null; $attachName = null; $fileNote = 'no file attached';
    if (isset($_FILES['resume']) && ($_FILES['resume']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
        $tmp  = (string)$_FILES['resume']['tmp_name'];
        $size = (int)($_FILES['resume']['size'] ?? 0);
        $orig = clean_line((string)($_FILES['resume']['name'] ?? 'resume'));
        $ext  = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
        $allowed = ['pdf', 'doc', 'docx', 'rtf', 'txt', 'odt'];
        if ($size > 8 * 1024 * 1024) { http_response_code(400); echo json_encode(['ok' => false, 'errors' => ['resume' => 'File too large (max 8 MB)']]); return; }
        if (!in_array($ext, $allowed, true)) { http_response_code(400); echo json_encode(['ok' => false, 'errors' => ['resume' => 'Unsupported file type']]); return; }
        if (is_uploaded_file($tmp)) {
            $attachData = @file_get_contents($tmp);
            $attachName = preg_replace('/[^A-Za-z0-9._-]/', '_', $orig) ?: ('resume.' . $ext);
            $fileNote   = "$attachName ($size bytes)";
        }
    }

    $subject = 'New Resume Submitted | Maxima Concrete';
    $text  = "New job application from the Maxima Concrete website.\n";
    $text .= str_repeat('-', 60) . "\n\n";
    $text .= "Name:      $name\n";
    $text .= "Phone:     $phone\n";
    $text .= "Email:     $email\n";
    $text .= "Position:  " . ($position !== '' ? $position : '-') . "\n";
    $text .= "Resume:    $fileNote\n\n";
    $text .= str_repeat('-', 60) . "\nMessage:\n\n" . ($msg !== '' ? $msg : '-') . "\n\n";
    $text .= str_repeat('-', 60) . "\nSubmitted: " . gmdate('Y-m-d H:i:s') . " UTC\n";
    $text .= "From IP:   " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

    if ($attachData !== null && $attachName !== null) {
        $boundary = '=_' . md5(uniqid('', true));
        $headers  = "From: $fromName <$fromEmail>\r\n";
        if ($hasEmail) $headers .= "Reply-To: $name <$email>\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        $body  = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $text . "\r\n";
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: application/octet-stream; name=\"$attachName\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$attachName\"\r\n\r\n";
        $body .= chunk_split(base64_encode($attachData)) . "\r\n";
        $body .= "--$boundary--";
        $ok = @mail($recipient, $subject, $body, $headers, '-f ' . $fromEmail);
    } else {
        $headers  = "From: $fromName <$fromEmail>\r\n";
        if ($hasEmail) $headers .= "Reply-To: $name <$email>\r\n";
        $headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\n";
        $ok = @mail($recipient, $subject, $text, $headers, '-f ' . $fromEmail);
    }

    log_submission([
        'ts' => gmdate('Y-m-d\TH:i:s\Z'), 'type' => 'resume',
        'name' => $name, 'phone' => $phone, 'email' => $email,
        'position' => $position, 'resume' => $fileNote, 'message' => $msg,
        'email_status' => $ok ? 'sent' : 'failed',
    ]);

    if ($ok) { echo json_encode(['ok' => true]); return; }
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Send failed. Please try again or email info@maximaconcrete.com.']);
}

// Honeypot — silently accept and drop.
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// Resume submissions (Join Our Team) use a dedicated handler.
if (($_POST['form_type'] ?? '') === 'resume') {
    handle_resume($RECIPIENT, $FROM_NAME, $FROM_EMAIL);
    exit;
}

$firstName = field('first_name');
$lastName  = field('last_name');
$phone     = field('phone');
$email     = field('email');
$street    = field('street');
$zip       = field('zip_code');
$hearAbout = field('hear_about');
$pageUrl   = field('page_url');
$message   = substr(trim((string)($_POST['message'] ?? '')), 0, 5000);

// services[] checkboxes
$services = [];
if (isset($_POST['services']) && is_array($_POST['services'])) {
    foreach ($_POST['services'] as $s) {
        $s = clean_line((string)$s);
        if ($s !== '') $services[] = $s;
    }
}

$errors = [];
if (strlen($firstName) < 2) $errors['first_name'] = 'Please enter your first name';
$hasPhone = strlen(preg_replace('/\D/', '', $phone)) >= 10;
$hasEmail = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
if (!$hasPhone && !$hasEmail) $errors['contact'] = 'Please enter a valid phone number or email';

if ($errors) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

$fullName = trim("$firstName $lastName");
$subject  = "New estimate request from $fullName";

$body  = "New estimate request from the Maxima Concrete website.\n";
$body .= str_repeat('-', 60) . "\n\n";
$body .= "Name:        $fullName\n";
$body .= "Phone:       $phone\n";
$body .= "Email:       $email\n";
$body .= "Address:     $street\n";
$body .= "ZIP:         $zip\n";
$body .= "Services:    " . ($services ? implode(', ', $services) : '-') . "\n";
$body .= "How heard:   $hearAbout\n";
$body .= "Page:        $pageUrl\n\n";
$body .= str_repeat('-', 60) . "\n";
$body .= "Message:\n\n";
$body .= ($message !== '' ? $message : '-') . "\n\n";
$body .= str_repeat('-', 60) . "\n";
$body .= "Submitted:   " . gmdate('Y-m-d H:i:s') . " UTC\n";
$body .= "From IP:     " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers   = [];
$headers[] = "From: $FROM_NAME <$FROM_EMAIL>";
if ($hasEmail) $headers[] = "Reply-To: $fullName <$email>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=utf-8";
$headers[] = "X-Mailer: Maxima Concrete Website";

$ok = @mail($RECIPIENT, $subject, $body, implode("\r\n", $headers), '-f ' . $FROM_EMAIL);

log_submission([
    'ts'           => gmdate('Y-m-d\TH:i:s\Z'),
    'ip'           => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'ua'           => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'first_name'   => $firstName,
    'last_name'    => $lastName,
    'phone'        => $phone,
    'email'        => $email,
    'street'       => $street,
    'zip_code'     => $zip,
    'services'     => $services,
    'hear_about'   => $hearAbout,
    'page_url'     => $pageUrl,
    'message'      => $message,
    'email_status' => $ok ? 'sent' : 'failed',
    'email_error'  => $ok ? null : 'mail() returned false',
]);

if ($ok) {
    echo json_encode(['ok' => true]);
    exit;
}

@error_log('[submit.php] mail() returned false');

http_response_code(500);
echo json_encode([
    'ok'    => false,
    'error' => 'Send failed. Please try again or call us directly.',
]);
