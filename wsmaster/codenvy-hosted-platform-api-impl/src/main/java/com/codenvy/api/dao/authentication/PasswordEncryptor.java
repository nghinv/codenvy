/*
 *  [2012] - [2017] Codenvy, S.A.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Codenvy S.A. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Codenvy S.A.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Codenvy S.A..
 */
package com.codenvy.api.dao.authentication;

/**
 * Encrypts password in implementation specific way
 */
public interface PasswordEncryptor {

    /**
     * Encrypts (digests) the given {@code password}
     *
     * @param password
     *         the plain password to be encrypted
     * @return the encrypted password
     * @throws RuntimeException
     *         when it is not possible to encrypt password
     */
    byte[] encrypt(byte[] password) throws RuntimeException;
}
