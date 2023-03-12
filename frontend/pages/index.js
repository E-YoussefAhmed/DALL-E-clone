import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import Card from "../components/Card.jsx";
import FormField from "../components/FormField.jsx";

// export const getStaticProps = async () => {
//   let data;
//   try {
//     const res = await fetch("https://dall-e-dnhj.onrender.com/api/v1/post", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (res.ok) {
//       data = await res.json();
//       setPosts(data.data.reverse());
//       console.log(data.data.reverse());
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   return {
//     props: { posts: data.data.reverse() },
//     revalidate: 10,
//   };
// };

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let data;
      try {
        const res = await fetch(
          "https://dall-e-dnhj.onrender.com/api/v1/post",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          data = await res.json();
          setPosts(data.data.reverse());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setLoading(true);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = posts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchResults(searchResults);
        setLoading(false);
      }, 1000)
    );
  };

  return (
    <>
      <section className="max-w-7xl mx-auto ">
        <div>
          <h1 className="font-extrabold text-[#222328] text-[32px]">
            The Community Showcase
          </h1>
          <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
            Browse through a collection of imaginative and visually stunning
            images generated by DALL-E AI
          </p>
        </div>
        <div className="mt-16">
          <FormField
            LabelName="Search posts"
            type="text"
            name="text"
            placeholder="Search posts"
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing results for{" "}
                  <span className="text-[#222328]">{searchText}</span>
                </h2>
              )}
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                {searchText ? (
                  <RenderCards
                    data={searchResults}
                    title="No search results found"
                  />
                ) : (
                  <RenderCards data={posts} title="No posts found" />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
