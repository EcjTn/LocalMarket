async function recaptchaMiddleware(req, res, next) {

    const recaptchaResponse = req.body['g-recaptcha-response'];
    if (!recaptchaResponse) {
        return res.status(400).json({ recaptcha_error: 'Recaptcha response is required.' });
    }
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;

    try {
        const response = await fetch(recaptchaUrl, {method: 'POST'});
        const data = await response.json();
        console.log(data)
        if (!data.success) return res.status(400).json({ error: 'Recaptcha verification failed.' });

        next();
    }
    catch (error) {
        console.error('Recaptcha verification error:', error.message);
        return res.status(500).json({ error: 'Internal server error during recaptcha verification.' });
    }
}



export default recaptchaMiddleware;