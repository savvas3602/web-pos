package com.savvasad.apps.helper;

import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.ResourceNotFoundException;
import com.savvasad.apps.exception.UserExistsException;

public class EntityHelper {
    private EntityHelper() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static void throwDuplicateResourceException(String entityName, String fieldName, String fieldValue) {
        throw new DuplicateResourceException(
            String.format("%s with %s '%s' already exists.", entityName, fieldName, fieldValue)
        );
    }

    public static ResourceNotFoundException throwResourceNotFoundException(String entityName, Long id) {
        throw new ResourceNotFoundException(
            String.format("%s with id '%d' does not exist.", entityName, id)
        );
    }

    public static void throwUserExistsException(String key, String value) {
        throw new UserExistsException(
            String.format("User with %s: '%s' already exists.", key, value)
        );
    }
}
