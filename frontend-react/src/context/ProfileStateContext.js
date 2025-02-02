import { createContext, useContext, useEffect, useReducer } from "react";
import { initialState } from "./ProfileStateReducer";
import profileStateReducer from "./ProfileStateReducer";
import { useSiteState } from "./SiteStateContext";

const ProfileStateContext = createContext();

export const ProfileStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileStateReducer, initialState);

  const { stateObject: siteState } = useSiteState();

  useEffect(() => {
    selectedCollectionType("published");
  }, []);

  const selectedCollectionType = (collectionType) => {
    let collection = siteState[collectionType] ? siteState[collectionType] : [];
    dispatch({
      type: "SET_SELLECTED_COLLECTION_TYPE",
      payload: {
        filteredCollection: [...collection],
        typeCollectionSelected: collectionType.toUpperCase(),
      },
    });
  };

  const filterCollectionByKeyword = (keyword) => {
    let collection = siteState[state.typeCollectionSelected.toLowerCase()]
      ? siteState[state.typeCollectionSelected.toLowerCase()]
      : [];
    dispatch({
      type: "FILTER_COLLECTION_BY_KEYWORD",
      payload: {
        keyword: keyword,
        collection: [...collection],
      },
    });
  };

  const toggleCreateTaleModalState = () => {
    dispatch({
      type: "SET_CREATE_TALE_MODAL_STATE",
      payload: {
        createTaleModalState: !state.createTaleModalState,
      },
    });
  };

  return (
    <ProfileStateContext.Provider
      value={{
        selectedCollectionType,
        toggleCreateTaleModalState,
        filterCollectionByKeyword,
        createTaleModalState: state.createTaleModalState,
        typeCollectionSelected: state.typeCollectionSelected,
        filteredCollection: state.filteredCollection,
        purchased: state.purchased,
      }}
    >
      {children}
    </ProfileStateContext.Provider>
  );
};

export const useProfileState = () => {
  const context = useContext(ProfileStateContext);
  if (!context) {
    throw new Error("useProfileState must be used within ProfileStateContext");
  }
  return context;
};

export default ProfileStateContext;
