const ALLOWED_EMAILS = [
    // Add your allowed email addresses here
    'pratikmishra1833@gmail.com',
];

export function isAuthorizedEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ALLOWED_EMAILS.includes(email.toLowerCase());
}
