package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.auth.AuthRequest;
import com.kordiukov.bioreactor.server.models.auth.AuthResponse;
import com.kordiukov.bioreactor.server.models.auth.User;
import com.kordiukov.bioreactor.server.repos.UserRepository;
import com.kordiukov.bioreactor.server.service.JwtUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RequestMapping("/users")
@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder,
                          ObjectMapper objectMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    private static final Logger logger = LogManager.getLogger(AuthController.class);

    private final ObjectMapper objectMapper;

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest authRequest) {
        logger.info("====== Trying to Login - " + authRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            String token = jwtUtil.generateToken(authRequest.getUsername());
            logger.info("====== Generated token - " + token);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/get-username")
    public ResponseEntity<String> getUsernameFromToken(@RequestHeader("Authorization") String token) {
        // Assuming the token comes as "Bearer token_value", so we remove the "Bearer " part
        String username = jwtUtil.extractUsername(token.substring(7));
        return ResponseEntity.ok(username);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
        }
        // hashing password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        // saving to DB
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PatchMapping("/{name}")
    public User patch(@PathVariable String name, @RequestBody JsonNode patchNode) throws IOException {
        User user = userRepository.findByUsername(name);

        objectMapper.readerForUpdating(user).readValue(patchNode);

        return userRepository.save(user);
    }
}