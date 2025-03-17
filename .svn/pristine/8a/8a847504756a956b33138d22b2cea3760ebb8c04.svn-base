package egovframework.common.component;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import egovframework.environment.network.NetworkUtil;
import egovframework.main.user.activity.code.LogCode;
import egovframework.main.user.activity.dto.ActivityDTO;
import egovframework.main.user.activity.service.ActivityService;
import egovframework.main.user.auth.dto.AuthDTO;
import egovframework.main.user.auth.service.AuthService;

@Component
public class ActivityLogHelper {
    private static final Logger logger = LoggerFactory.getLogger(ActivityLogHelper.class);

    @Resource
    private ActivityService activityService;

    @Resource
    private AuthService authService;

    public void logUserActivity(String username, LogCode logCode, int logLevel) {
        logUserActivity(username, NetworkUtil.getCurrentIpAddress(), logCode, logLevel);
    }

    public void logUserActivity(String username, String ip, LogCode logCode, int logLevel) {
        try {
            AuthDTO user = authService.selectUserByEmail(username);
            ActivityDTO activity = new ActivityDTO();
            activity.setUser_no(user != null ? user.getUser_no() : -1);
            activity.setGroup_no(user != null ? user.getGroup_no() : -1);
            activity.setLog_cd(logCode.getCode());
            activity.setLog_level(logLevel);
            activity.setMsg(logCode.getDescription());
            activity.setIp(ip);
            
            activityService.insertUserLog(activity);
            
            if (logLevel == 1) {
                logger.info("{}: {}", logCode.getDescription(), username);
            } else {
                logger.warn("{}: {}", logCode.getDescription(), username);
            }
        } catch (Exception e) {
            logger.error("Failed to log {} event: {}", logCode.getDescription(), e.getMessage());
        }
    }
}