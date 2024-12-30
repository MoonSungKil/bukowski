export const initialTaleState = {
  tales: [],
  singleTaleSelected: {},
  purchasedTales: [],
  selectedTalePurchased: {},
};

export const taleReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_ALL_TALES":
      return {
        ...state,
        tales: payload.tales,
      };
    case "GET_SINGLE_TALE":
      return {
        ...state,
        singleTaleSelected: payload.singleTaleSelected,
      };
    case "GET_ALL_PURCHASED_TALES":
      return {
        ...state,
        purchasedTales: [...payload.purchasedTales],
      };
    default:
      console.log("default");
      return state;
  }
};

export default taleReducer;
