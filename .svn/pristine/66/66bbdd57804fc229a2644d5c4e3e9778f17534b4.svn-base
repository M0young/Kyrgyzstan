package egovframework.main.admin.user.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.user.dao.AdminDAO;
import egovframework.main.admin.user.dto.AdminDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("adminService")
public class AdminService extends EgovAbstractServiceImpl {

    @Resource(name = "adminDAO")
    private AdminDAO adminDAO;
    
    public int countAllUsers(AdminDTO adminDTO) {
        return adminDAO.countAllUsers(adminDTO);
    }
    
    public List<AdminDTO> selectPagedUsers(AdminDTO adminDTO) {
        return adminDAO.selectPagedUsers(adminDTO);
    }
    
    public void updateUser(AdminDTO user) {
        adminDAO.updateUser(user);
    }
    
    public void deleteUser(String eml) {
        if (eml == null || eml.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        adminDAO.deleteUser(eml);
    }
    

    public List<AdminDTO> selectUserGroups() {
        return adminDAO.selectUserGroups();
    }
}
