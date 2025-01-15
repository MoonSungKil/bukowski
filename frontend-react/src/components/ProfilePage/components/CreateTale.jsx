import React, { useState } from "react";
import "./CreateTale.css";
import { useProfileState } from "../../../context/ProfileStateContext";
import { useSiteState } from "../../../context/SiteStateContext";

const CreateTale = () => {
  const { toggleCreateTaleModalState } = useProfileState();

  const { userLoggedIn, createTale } = useSiteState();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [publisher, setPublisher] = useState(userLoggedIn.username);
  const [genreOne, setGenreOne] = useState("");
  const [genreTwo, setGenreTwo] = useState("");
  const [genreThree, setGenreThree] = useState("");
  const [content, setContent] = useState("");

  const submitCreateTale = (e) => {
    e.preventDefault();

    const pages = content.length > 1800 ? Math.ceil(content.length / 1800) : 1;
    createTale({
      title,
      description,
      preview: content.substring(0, 100) + "...",
      content,
      author: publisher,
      pages,
      price: parseFloat(price),
      status: "published",
      genres: [genreOne, genreTwo, genreThree],
      published_at: new Date().toISOString(),
    });
  };

  return (
    <div className="create_tale">
      <form onSubmit={submitCreateTale} className="create_tale_form">
        <div className="create_tale_info">
          <div className="create_tale_info_element create_tale_title">
            <label htmlFor="title">Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              name="title"
            />
          </div>
          <div className="create_tale_info_element create_tale_image_genres">
            <div className="create_tale_image">
              <span>Add Cover Image</span>
              <div className="create_tale_image_backdrop">
                <i className="fa-solid fa-plus"></i>
              </div>
            </div>
            <div className="create_tale_genres">
              <label htmlFor="genre">Genres</label>
              <select>
                <option onChange={(e) => setGenreOne(e.target.value)} value="Surrealism">
                  Surrealism
                </option>
                <option onChange={(e) => setGenreOne(e.target.value)} value="Existentialism">
                  Existentialism
                </option>
              </select>
              <select>
                <option onChange={(e) => setGenreTwo(e.target.value)} value="Fantasy">
                  Fantasy
                </option>
              </select>
              <select>
                <option onChange={(e) => setGenreThree(e.target.value)} value="Philosophy">
                  Philosophy
                </option>
              </select>
            </div>
          </div>
          <div className="create_tale_info_element create_tale_description">
            <label htmlFor="textarea_description">Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              name="textarea_description"
            />
          </div>
          <div className="create_tale_info_element create_tale_publisher_price">
            <div className="create_tale_publisher">
              <label htmlFor="publisher">Publisher</label>
              <div className="create_tale_publisher_element">
                <label>Username</label>
                <input
                  onChange={(e) => setPublisher(userLoggedIn.username)}
                  type="radio"
                  defaultChecked
                  name="publisher"
                  value={userLoggedIn.username}
                />
              </div>
              <div className="create_tale_publisher_element">
                <label>Anonymous</label>
                <input
                  onChange={(e) => setPublisher(e.target.value)}
                  type="radio"
                  name="publisher"
                  value="Anonymous"
                />
              </div>
            </div>
            <div className="create_tale_price">
              <label htmlFor="price">Price</label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                name="price"
              />
            </div>
          </div>

          <div className="create_tale_info_element create_tale_btns">
            <div className="create_tale_draft_delete">
              <button className="create_tale_draft">DRAFT</button>
              <button onClick={() => toggleCreateTaleModalState()} className="create_tale_delete">
                DELETE
              </button>
            </div>
            <button type="submit" className="create_tale_publish">
              PUBLISH
            </button>
          </div>
        </div>
        <div className=" create_tale_content">
          <textarea onChange={(e) => setContent(e.target.value)} value={content} />
        </div>
      </form>
    </div>
  );
};

export default CreateTale;
