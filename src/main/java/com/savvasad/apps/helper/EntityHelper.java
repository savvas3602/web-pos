package com.savvasad.apps.helper;

import com.savvasad.apps.exception.DuplicateResourceException;
import com.savvasad.apps.exception.ResourceNotFoundException;

public class EntityHelper {
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
}
