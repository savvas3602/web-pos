package com.savvasad.apps.controller;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Cross-cutting logging for controller endpoints.
 * Logs entry, successful return, and exceptions for public controller methods.
 * Uses concise structured messages to avoid payload/PII leakage.
 */
@Aspect
@Component
public class ControllerLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(ControllerLoggingAspect.class);

    /**
     * Defines a pointcut that matches all public methods in any class ending with "Controller"
     * within the com.savvasad.apps.controller package.
     */
    @Pointcut("execution(public * com.savvasad.apps.controller.*Controller.*(..))")
    public void controllerMethods() {}

    @Before("controllerMethods()")
    public void logEntry(JoinPoint jp) {
        if (logger.isDebugEnabled()) {
            logger.debug("controller.entry name={} argsCount={}", jp.getSignature().toShortString(), jp.getArgs().length);
        }
    }

    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logReturn(JoinPoint jp, Object result) {
        if (logger.isDebugEnabled()) {
            String returnDesc = result == null ? "null" : result.getClass().getSimpleName();
            logger.debug("controller.exit name={} returnType={}", jp.getSignature().toShortString(), returnDesc);
        }
    }

    @AfterThrowing(pointcut = "controllerMethods()", throwing = "ex")
    public void logException(JoinPoint jp, Throwable ex) {
        // Note: We do not log method arguments here to prevent leaking sensitive data.
        if (logger.isWarnEnabled()) {
            logger.warn("controller.exception name={} exType={} message={}"
                    , jp.getSignature().toShortString()
                    , ex.getClass().getSimpleName()
                    , ex.getMessage());
        }
    }
}

