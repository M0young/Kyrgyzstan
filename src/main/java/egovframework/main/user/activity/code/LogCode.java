package egovframework.main.user.activity.code;

public enum LogCode {
    // 인증 관련 (10-19)
	REGISTER(10, "회원가입"),
    LOGIN_SUCCESS(11, "로그인 성공"),
    LOGIN_FAIL(12, "로그인 실패"),
    LOGIN_LOCKED(13, "계정 잠금(로그인 5회 실패)"),
    SESSION_EXPIRED(14, "세션 만료"),
    SESSION_EXTENDED(15, "세션 연장"),
    DUPLICATE_LOGIN(16, "중복 로그인"),
    TEMP_PASSWORD_ISSUED(17, "임시 비밀번호 발급"),
    LOGOUT(18, "로그아웃"),

    // 프로필 관리 (20-29)
    UPDATE_PASSWORD(20, "비밀번호 변경"),
    UPDATE_PROFILE(21, "회원정보 수정"),

    // 관리자 작업 (30-39)
    ADMIN_UPDATE_USER(30, "회원정보 수정(관리자)"),
    ADMIN_DELETE_USER(31, "회원정보 삭제"),
    ADMIN_CHANGE_PERMISSION(32, "권한 변경");

    private final int code;
    private final String description;

    LogCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}