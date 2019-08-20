import { useReducer, useCallback } from 'react';

const inititialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
}


const httpReducer = (state, action) => {
    switch (action.type) {
        case 'SEND_REQUEST':
            return { loading: true, error: null, data: null, extra: null, identifier: action.identifier }
        case 'RESPONSE':
            return { ...state, loading: false, data: action.data, extra: action.extra }
        case 'ERROR':
            return { ...state, loading: false, error: action.errorData }
        case 'CLEAR':
            return inititialState
        default:
            throw new Error('Should not be reached');
    }
}

const useHTTP = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, inititialState)

    const clear = useCallback(() => {
        return dispatchHttp({type: 'CLEAR'})
    }, [])

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({ type: 'SEND_REQUEST', identifier: reqIdentifier })
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(responseData => {
            console.log('Response is', responseData)
            dispatchHttp({ type: 'RESPONSE', data: responseData, extra: reqExtra })
        })
            .catch((error) => {
                dispatchHttp({ type: 'Error', errorData: 'Something went really wrong' })
            })
    }, [])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        extra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    }


};

export default useHTTP;