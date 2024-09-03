package com.kordiukov.bioreactor.server;

import com.kordiukov.bioreactor.server.service.JwtUtil;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class) // TESTS IN ORDER
public class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @Order(1)
    public void shouldRegisterUserSuccessfully() throws Exception { // Testing registration
        String userJson = "{ \"username\": \"testuser\", \"password\": \"password123\" }";

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    @Order(2)
    public void shouldAuthenticateUserAndReturnJwtToken() throws Exception { // Testing authentication
        String userJson = "{ \"username\": \"user1\", \"password\": \"123\" }";
        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson));

        // TESTING NEW ACCUNT
        String authRequestJson = "{ \"username\": \"user1\", \"password\": \"123\" }";
        System.out.println("--------------------------- REQUEST: " + authRequestJson);

        mockMvc.perform(post("/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }


    @Test
    @Order(3)
    public void shouldDenyAccessWithoutJwtToken() throws Exception {
        mockMvc.perform(patch("/users/testuser")) // not now
                .andExpect(status().is4xxClientError());
    }


    @Test
    @Order(4)
    public void shouldAllowAccessWithJwtToken() throws Exception {


        String jwtToken = "Bearer " + generateValidJwtTokenForTest("testuser");

        String updateUserJson = "{ \"username\": \"testuser2\" }";

        mockMvc.perform(patch("/users/testuser")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateUserJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser2"));
    }

    private String generateValidJwtTokenForTest(String username) {
        return jwtUtil.generateToken(username);
    }
}
