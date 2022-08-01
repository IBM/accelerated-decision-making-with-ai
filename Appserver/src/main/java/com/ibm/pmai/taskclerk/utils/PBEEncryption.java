/*
 * Copyright 2022 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ibm.pmai.taskclerk.utils;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Component;
import org.springframework.util.Base64Utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import java.security.SecureRandom;
import java.security.Security;
/*
  */

/**
 * Used for encyting document using AES 256
 */
@Component
public class PBEEncryption
{
    /**
     * Used to add security provider, we are using bouncy castle
     */
    public PBEEncryption(){
        Security.addProvider(new BouncyCastleProvider());
    }

    /**
     * Encrypts jsonobject using the supplied key
     * @param password
     * @param data
     * @return
     * @throws Exception
     */
    public static String encrypt(char[] password, byte[] data) throws Exception {

        Security.addProvider(new BouncyCastleProvider());

        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

        byte[] salt = new byte[8];
        SecureRandom sr = new SecureRandom();
        sr.nextBytes(salt);

        PBEKeySpec keySpec = new PBEKeySpec(password);

        SecretKeyFactory keyFactory = SecretKeyFactory
		        .getInstance("PBEWithSHAAnd3KeyTripleDES", "BC");

        SecretKey key = keyFactory.generateSecret(keySpec);

        PBEParameterSpec paramSpec = new PBEParameterSpec(salt, 1000);

        Cipher cipher = Cipher.getInstance("PBEWithSHAAnd3KeyTripleDES", "BC");

        cipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);

        byte[] ciphertext = cipher.doFinal(data);

        String saltString = Base64Utils.encodeToString(salt);
        String ciphertextString = Base64Utils.encodeToString(ciphertext);

        String combined= saltString + ciphertextString;
//        JsonObject data = new JsonParser().parse(combined).getAsJsonObject();

        return combined;
    }

    /**
     * Used to decrypt the old supplied using the provided key
     * @param password
     * @param text
     * @return
     * @throws Exception
     */
    public String decrypt(char[] password, String text) throws Exception {
        String salt = text.substring(0, 12);
        String ciphertext = text.substring(12, text.length());
        byte[] saltArray = Base64Utils.decodeFromString(salt);
        byte[] ciphertextArray = Base64Utils.decodeFromString(ciphertext);

        PBEKeySpec keySpec = new PBEKeySpec(password);

        SecretKeyFactory keyFactory = SecretKeyFactory
		        .getInstance("PBEWithSHAAnd3KeyTripleDES", "BC");

        SecretKey key = keyFactory.generateSecret(keySpec);

        PBEParameterSpec paramSpec = new PBEParameterSpec(saltArray, 1000);

        Cipher cipher = Cipher.getInstance("PBEWithSHAAnd3KeyTripleDES", "BC");

        cipher.init(Cipher.DECRYPT_MODE, key, paramSpec);

        String cipherString= new String(cipher.doFinal(ciphertextArray));

//        JsonObject data = new JsonParser().parse(cipherString).getAsJsonObject();

        return cipherString;

    }
}
