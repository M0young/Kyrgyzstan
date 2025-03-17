package egovframework.main.admin.role.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.role.dao.RoleDAO;
import egovframework.main.admin.role.dto.RoleDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("roleService")
public class RoleService extends EgovAbstractServiceImpl {
   
   @Resource(name = "roleDAO")
   private RoleDAO roleDAO;
   
   public List<RoleDTO> selectPagedGroupAuthryList(RoleDTO roleDTO) {
       return roleDAO.selectPagedGroupAuthryList(roleDTO);
   }
   
   public List<Integer> selectAuthryInfo(Integer groupNo) {
       return roleDAO.selectAuthryInfo(groupNo);
   }
   
   public void insertGroupAuthry(RoleDTO roleDTO) {
       roleDAO.insertGroupAuthry(roleDTO);
   }
   
   public void updateAuthryList(Integer groupNo, List<Integer> authryNos) {
       roleDAO.updateAuthryList(groupNo, authryNos);
       roleDAO.updateAuthryDate(groupNo);
   }
}
