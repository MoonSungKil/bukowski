export const initialState = {
  typeCollectionSelected: "Purchased",
  filteredCollection: [],
  createTaleModalState: false,
};

export const profileStateReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_SELLECTED_COLLECTION_TYPE":
      return {
        ...state,
        filteredCollection: payload.filteredCollection,
        typeCollectionSelected: payload.typeCollectionSelected,
      };
    case "SET_CREATE_TALE_MODAL_STATE":
      return {
        ...state,
        createTaleModalState: payload.createTaleModalState,
      };
    default:
      return {
        ...state,
      };
  }
};

export default profileStateReducer;
