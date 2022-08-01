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
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/*
  */

/**
 * This class is used to generate document hash using SHA-256 and also used to compare the hashes
 */
@Component
public class Sha256DocumentHasher implements DocumentHashingInterface {

    /**
     * This is used to generate document hash, the document is passed in byte array
     * @param data
     * @return
     * @throws IOException
     * @throws NoSuchAlgorithmException
     */
    @Override
    public String getHash(byte[] data) throws IOException, NoSuchAlgorithmException {

        /**
         * Create message digest using SHA-256
         */
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        /**
         * Update the data
         */
        md.update(data, 0, data.length);

        /**
         * Generate the digest
         */
        byte[] digestBytes = md.digest();


        /**
         * convert the byte to hex format method 2
         */
        StringBuilder hexString = new StringBuilder();
        for (byte mdbyte : digestBytes) {
            hexString.append(Integer.toHexString(0xFF & mdbyte));
        }
        return hexString.toString();
    }


    /**
     * Computes the has of the byte data sent and compare with with the given hash
     * @param hash
     * @param data
     * @return
     * @throws IOException
     * @throws NoSuchAlgorithmException
     */
    @Override
    public boolean compareHashes(String hash, byte[] data) throws IOException, NoSuchAlgorithmException {
        return getHash(data).equals(hash);
    }

    /**
     * Compare two hashes passed
     * @param hash1
     * @param hash2
     * @return
     * @throws IOException
     * @throws NoSuchAlgorithmException
     */
    @Override
    public boolean compareHashesStrings(String hash1, String hash2) throws IOException, NoSuchAlgorithmException {
        return hash1.equals(hash2);
    }
}
