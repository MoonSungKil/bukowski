import React, { useEffect, useRef, useState } from "react";
import "./Compose.css";
import { useSiteState } from "../../../context/SiteStateContext";
import coverPhotoTest from "../../../assets/cover/cover_placeholder.jpg";
import { useNavigate, useParams } from "react-router-dom";

const Compose = () => {
  const { userLoggedIn, createTale, createDraft, convertDraftToTale, updateDraft, deleteDraft } =
    useSiteState();

  const { tale_id } = useParams();

  const navigate = useNavigate();

  const { getSingleDraft } = useSiteState();
  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genreOne, setGenreOne] = useState("None");
  const [genreTwo, setGenreTwo] = useState("None");
  const [genreThree, setGenreThree] = useState("None");
  const [imagePreview, setImagePreview] = useState(null);

  const [draft, setDraft] = useState();

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const fetchedDraft = await getSingleDraft(tale_id);
        setDraft(fetchedDraft);

        if (fetchDraft) {
          setTitle(fetchedDraft.title || "");
          setContent(fetchedDraft.content || "");
          setDescription(fetchedDraft.description || "");
          setPrice(fetchedDraft.price || "");
          setImagePreview(
            fetchedDraft.tale_image && (`${backendURL}${fetchedDraft.tale_image}` || null)
          );
          setGenreOne(fetchedDraft.genres[0].name || "None");
          setGenreTwo(fetchedDraft.genres[1].name || "None");
          setGenreThree(fetchedDraft.genres[2].name || "None");
        }
      } catch (error) {
        console.log("Failed to fetch");
      }
    };

    fetchDraft();
  }, []);

  const inputRef = useRef();
  const [file, setFile] = useState(null);

  // Change the preview URL
  const changePreviewImage = (e) => {
    const file = e.target.files[0]; // gets the first selected
    if (file) {
      const previewUrl = URL.createObjectURL(file); //create a temporary url
      setImagePreview(previewUrl);
      setFile(file);
    }
  };

  // Trigger the Input File (because its set to display non due to aesthetic reasons)
  const onChooseFile = () => {
    inputRef.current.click();
  };

  // Submitting The Tale
  const submitTale = async (e, type) => {
    e.preventDefault();
    const pages = content.length > 1800 ? Math.ceil(content.length / 1800) : 1;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("preview", content.substring(0, 100) + "...");
    formData.append("content", content);
    formData.append("author", userLoggedIn.username);
    formData.append("pages", pages);
    formData.append("file", file); // File input
    formData.append("price", price);
    formData.append("status", "published");
    formData.append("genres", JSON.stringify([genreOne, genreTwo, genreThree]));
    formData.append("published_at", new Date().toISOString());

    if (type === "publish") {
      formData.forEach((f) => console.log(f));
      if (tale_id) {
        const newTaleCreated = await convertDraftToTale(formData, tale_id);
        if (newTaleCreated) {
          navigate(`/tale/${newTaleCreated.ID}`);
        }
      } else {
        const newTaleCreated = await createTale(formData);
        if (newTaleCreated) {
          navigate(`/tale/${newTaleCreated.ID}`);
        }
      }
    }
    if (type === "draft") {
      if (tale_id) {
        const updatedDraft = await updateDraft(formData, tale_id);
        console.log(updatedDraft);
      } else {
        const newDraftCreated = await createDraft(formData);
        navigate(`/profile/${userLoggedIn.id}`);
      }
    }
  };

  const onDeleteDraft = async (e) => {
    e.preventDefault();

    if (tale_id) {
      await deleteDraft(tale_id);
    }

    navigate(`/profile/${userLoggedIn.id}`);
  };

  return (
    <div className="compose">
      <form className="compose_form">
        <div className="compose_title">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            name="title"
            placeholder="Enter a title for your Tale"
          />
        </div>
        <div className="compose_form_body">
          <div className="compose_form_body_left">
            <div className="compose_image">
              <div className={`compose_image_preview`}>
                <img src={imagePreview ? imagePreview : coverPhotoTest} alt="cover_image" />
              </div>
              <div className="compose_image_buttons">
                <div onClick={onChooseFile} className="compose_image_select_button">
                  <span>Choose Image</span>
                  <i className="fa-solid fa-upload"></i>
                  <input onChange={changePreviewImage} type="file" ref={inputRef} />
                </div>
                <div onClick={() => setImagePreview(null)} className="compose_image_remove_button">
                  <span>Remove Image</span>
                  <i className="fa-solid fa-trash"></i>
                </div>
              </div>
            </div>
            <div className="compose_genres">
              <label htmlFor="genre">Assign Genres</label>
              <select value={genreOne} onChange={(e) => setGenreOne(e.target.value)}>
                <option value={genreOne}>{genreOne}</option>
                <option value="Surrealism">Surrealism</option>
                <option value="Existentialism">Existentialism</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="Poetry">Poetry</option>
              </select>
              <select value={genreTwo} onChange={(e) => setGenreTwo(e.target.value)}>
                <option value={genreTwo}>{genreTwo}</option>
                <option value="Surrealism">Surrealism</option>
                <option value="Existentialism">Existentialism</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="Poetry">Poetry</option>
              </select>
              <select value={genreThree} onChange={(e) => setGenreThree(e.target.value)}>
                <option value={genreThree}>{genreThree}</option>
                <option value="Surrealism">Surrealism</option>
                <option value="Existentialism">Existentialism</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="Poetry">Poetry</option>
              </select>
            </div>
          </div>
          <div className="compose_form_body_middle">
            <div className="compose_content">
              <textarea onChange={(e) => setContent(e.target.value)} value={content} />
            </div>
          </div>
          <div className="compose_form_body_right">
            <div className="compose_description">
              <label htmlFor="textarea_description">Description</label>
              <textarea
                className="textarea_description"
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                name="textarea_description"
              />
            </div>
            <div className="compose_price_pages">
              <div className="compose_price">
                <label htmlFor="price">Price</label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  name="price"
                />
              </div>
              <div className="compose_pages_count">
                <label>Pages</label>
                <input
                  value={content.length > 1800 ? Math.ceil(content.length / 1800) : 1}
                  type="number"
                  name="price"
                />
              </div>
            </div>
            <div className="compose_form_buttons">
              <button onClick={(e) => submitTale(e, "draft")} className="compose_draft">
                SAVE DRAFT
              </button>
              <butto
                onClick={(e) => submitTale(e, "publish")}
                type="submit"
                className="compose_publish"
              >
                PUBLISH TALE
              </butto>
              <button onClick={(e) => onDeleteDraft(e)} className="compose_delete">
                DELETE DRAFT
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Compose;
