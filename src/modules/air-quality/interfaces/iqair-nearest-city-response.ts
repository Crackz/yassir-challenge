export interface IQAIRNearestCitySuccessResponse {
    status: 'success';
    data: {
        current: {
            pollution: {
                ts: string;
                aqius: string;
                aqicn: string;
                mainus: string;
                maincn: string;
            };
        };
    };
}
export interface IQAIRNearestCityFailResponse {
    status: 'fail';
    data: {
        message: string;
    };
}

export type IQAIRNearestCityResponse =
    | IQAIRNearestCitySuccessResponse
    | IQAIRNearestCityFailResponse;
