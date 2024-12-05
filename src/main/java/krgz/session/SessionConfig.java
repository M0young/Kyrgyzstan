package krgz.session;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@WebListener
public class SessionConfig implements HttpSessionListener{
	
    private static final Map<String, HttpSession> sessions = new ConcurrentHashMap<>();

    public synchronized static String getSessionidCheck(String type, String compareId){
    	for( String key : sessions.keySet() ){
			HttpSession hs = sessions.get(key);
			if(hs != null &&  hs.getAttribute(type) != null && hs.getAttribute(type).toString().equals(compareId) ){
				return "DUPLICATE";
			}
		}
		return null;
    }
    
//    private static void removeSessionForDoubleLogin(String userId){
//        if(userId != null && userId.length() > 0){
//            sessions.get(userId).invalidate();
//            sessions.remove(userId);    		
//        }
//    }

    @Override
    public void sessionCreated(HttpSessionEvent hse) {
        sessions.put(hse.getSession().getId(), hse.getSession());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent hse) {
        if(sessions.get(hse.getSession().getId()) != null){
            sessions.get(hse.getSession().getId()).invalidate();
            sessions.remove(hse.getSession().getId());
        }
    }
}    