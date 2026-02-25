package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.CreateUserRequest;
import com.sba301.retailmanagement.dto.request.UpdateUserRequest;
import com.sba301.retailmanagement.dto.response.UserDTO;

import java.util.List;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    UserDTO getUserByEmail(String email);

    UserDTO createUser(CreateUserRequest request);

    UserDTO updateUser(Long id, UpdateUserRequest request);

    UserDTO toggleBlockUser(Long id);

    void deleteUser(Long id);
}
