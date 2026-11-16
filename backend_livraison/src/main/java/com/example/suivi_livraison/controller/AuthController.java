package com.example.suivi_livraison.controller;

import com.example.suivi_livraison.DTO.LoginRequest;
import com.example.suivi_livraison.DTO.RegisterRequest;
import com.example.suivi_livraison.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
   
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    String email = request.getEmail();       
    String motDePasse = request.getPassword();

    var authResp = authService.loginResponse(email, motDePasse);

    if (authResp != null) {
        return ResponseEntity.ok(authResp);
    } else {
        return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
    }
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok("Utilisateur ajouté avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'ajout de l'utilisateur : " + e.getMessage());
        }
    }

    @PostMapping("/register-batch")
    public ResponseEntity<?> registerBatch(@RequestBody List<RegisterRequest> users) {
        try {
            authService.registerBatch(users);
            return ResponseEntity.ok("Utilisateurs ajoutés avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'ajout des utilisateurs : " + e.getMessage());
        }
    }
}