package com.kordiukov.bioreactor.supplements;

import com.kordiukov.bioreactor.supplements.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UsersControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtUtil jwtUtil;

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception { // Testing registration
        String userJson = "{ \"username\": \"testuser\", \"password\": \"password123\" }";

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    public void shouldAuthenticateUserAndReturnJwtToken() throws Exception { // Testing authentication
        String authRequestJson = "{ \"username\": \"testuser\", \"password\": \"password123\" }";
        System.out.println("--------------------------- REQUEST: " + authRequestJson);

        mockMvc.perform(post("/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }


    @Test
    public void shouldDenyAccessWithoutJwtToken() throws Exception {
        mockMvc.perform(patch("/users/testuser")) // not now
                .andExpect(status().is4xxClientError());
    }


    @Test
    public void shouldAllowAccessWithJwtToken() throws Exception {
        // Предположим, что у вас есть метод для генерации валидного токена
//        String jwtToken = "Bearer " + generateValidJwtTokenForTest("testuser");

        String jwtToken = "Bearer " + generateValidJwtTokenForTest("testuser");

        String updateUserJson = "{ \"username\": \"newusername\" }";

        mockMvc.perform(patch("/users/testuser")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateUserJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newusername"));
    }

    private String generateValidJwtTokenForTest(String username) {
        return jwtUtil.generateToken(username);
    }
}
