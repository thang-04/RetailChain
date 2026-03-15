package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.StockRequestCreateRequest;
import com.sba301.retailmanagement.dto.request.StockRequestRejectRequest;
import com.sba301.retailmanagement.dto.response.StockRequestResponse;

import java.util.List;

public interface StockRequestService {

    StockRequestResponse createRequest(StockRequestCreateRequest request);

    List<StockRequestResponse> getPendingRequests();

    List<StockRequestResponse> getStoreRequests(Long storeId);

    StockRequestResponse getRequestById(Long id);

    StockRequestResponse approveRequest(Long id);

    StockRequestResponse rejectRequest(Long id, StockRequestRejectRequest request);

    StockRequestResponse cancelRequest(Long id, String reason);
}
