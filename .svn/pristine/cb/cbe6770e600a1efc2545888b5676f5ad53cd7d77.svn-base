package egovframework.common.language;

import java.util.Locale;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.LocaleResolver;

@Controller
public class LanguageController {

	@Resource
    private LocaleResolver localeResolver;
    
    @PostMapping("/change-language")
    public ResponseEntity<Object> changeLanguage(@RequestParam String lang,
            HttpServletRequest request, HttpServletResponse response) {
        Locale locale = new Locale(lang);
        localeResolver.setLocale(request, response, locale);
        
        Cookie cookie = new Cookie("language", locale.toString());
        cookie.setMaxAge(365 * 24 * 60 * 60);
        response.addCookie(cookie);
        
        return ResponseEntity.ok().build();
    }
}
