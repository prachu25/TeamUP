package com.teamup.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // TRIGER VAILDATION
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handlerValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // DUPLICATE EMAIL
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<String> handlerDuplicateEmail(DuplicateEmailException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.CONFLICT);
    }

    // INVALID CREDENTIALS
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentials(
            InvalidCredentialsException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED);
    }

    // Already Participate in hackathons
    @ExceptionHandler(AlreadyParticipatingException.class)
    public ResponseEntity<String> handleAlreadyParticipating(AlreadyParticipatingException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.CONFLICT);
    }

    // HackathonNotFOundException
    @ExceptionHandler(HackathonNotFoundException.class)
    public ResponseEntity<String> handelHackthonNotFoundExceptionn(HackathonNotFoundException ex) {

        return new ResponseEntity<>(
                ex.getMessage(),
                HttpStatus.NOT_FOUND);
    }

    // User Not Found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(
            IllegalStateException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(
            IllegalArgumentException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

}
