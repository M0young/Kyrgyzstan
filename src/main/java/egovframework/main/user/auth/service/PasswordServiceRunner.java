package egovframework.main.user.auth.service;


public class PasswordServiceRunner {

    public static void main(String[] args) {
        PasswordService passwordService = new PasswordService();
        String rawPassword = "egis2395!";
        String encryptedPassword = passwordService.encryptPassword(rawPassword);

        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Encrypted Password: " + encryptedPassword);
    }
}