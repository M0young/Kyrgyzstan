package egovframework.environment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GeoServerConfig {
    @Value("#{globalProperties['Globals.geoserver.url']}")
    private String url;
    
    @Value("#{globalProperties['Globals.geoserver.authorization']}")
    private String authorization;
    
    @Value("#{globalProperties['Globals.geoserver.data.path']}")
    private String dataPath;

    @Value("#{globalProperties['Globals.geoserver.workspace']}")
    private String workspace;

    @Value("#{globalProperties['Globals.geoserver.store']}")
    private String store;

    @Value("#{globalProperties['Globals.geoserver.schema']}")
    private String schema;
    
    public String getUrl() {
        if (url == null || url.isEmpty()) {
            throw new IllegalStateException("GeoServer URL이 설정되지 않았습니다.");
        }
        return url;
    }

    public String[] getAuth() {
        if (authorization == null || authorization.isEmpty()) {
            throw new IllegalStateException("GeoServer 인증 정보가 설정되지 않았습니다.");
        }
        return authorization.split(":");
    }

    public String getDataPath() {
        if (dataPath == null || dataPath.isEmpty()) {
            throw new IllegalStateException("GeoServer 데이터 경로가 설정되지 않았습니다.");
        }
        return dataPath;
    }

    public String getWorkspace() {
        if (workspace == null || workspace.isEmpty()) {
            throw new IllegalStateException("GeoServer workspace가 설정되지 않았습니다.");
        }
        return workspace;
    }

    public String getStore() {
        if (store == null || store.isEmpty()) {
            throw new IllegalStateException("GeoServer store가 설정되지 않았습니다.");
        }
        return store;
    }

    public String getSchema() {
        if (schema == null || schema.isEmpty()) {
            throw new IllegalStateException("Database schema가 설정되지 않았습니다.");
        }
        return schema;
    }
}