export class Utils {
    /**
     * @param tokens missing env vars
     *
     * Returns message complainig about missing env variables. Respects plural forms.
     * If the array of tokens is empty, returns an empty string.
     */
    static getMissingVarsMsg(tokens: string[]) {
        if (!tokens.length) {
            return '';
        }

        let msg = tokens.join(', ');

        if (tokens.length > 1) {
            msg += ' variables are missing! You must provide them.';

        } else {
            msg += ' variable is missing! You must provide it.';
        }

        return msg;
    }

    /** Constructs hostname and port (if any) part of the URL. */
    static constructURLAuthority(host: string, port?: string | number) {
        return `${host}${port ? ':' + port : ''}`;
    }
}
