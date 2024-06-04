class GenerateOtp {
    async generateOtp(length: number): Promise<string> {
        const numerics = "0123456789";
        let code = Array.from({ length }, () => numerics.charAt(Math.floor(Math.random() * numerics.length))).join('');
        return code;
    }
}

export default GenerateOtp;