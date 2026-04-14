package com.savvasad.apps.enums;

import org.springframework.security.core.GrantedAuthority;

/**
 * Valid user roles in the application
 */
public enum UserRole implements GrantedAuthority {
    USER, ADMIN;

    @Override
    public String getAuthority() {
        return "ROLE_" + name();
    }
}
