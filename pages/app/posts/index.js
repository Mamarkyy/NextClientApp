import EmployerNavbar from "@/layout/EmployerNavbar";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Posts from "./templates/posts";

export default function EmployerPosts() {
  const { data: session, status, loading } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="h-screen">
      {session ? (
        <DisplayPosts session={session} handleSignOut={handleSignOut} />
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

const EmptyJobPosts = () => {
  return (
    <div className="flex flex-col align-items-center justify-content-center mx-auto p-5">
      <div className="text-center">
        <h1 className="text-2xl">You have no active job posts.</h1>
        <p className="text-lg">
          Click the button below to create a new job post.
        </p>
      </div>
    </div>
  );
};

const EmptyJobHistory = () => {
  return (
    <div className="flex flex-col align-items-center justify-content-center mx-auto p-5">
      <div className="text-center">
        <h1 className="text-2xl">You have no job history.</h1>
        <p className="text-lg">
          Click the button below to create a new job post.
        </p>
      </div>
    </div>
  );
};

const PostPanel = ({ posts }) => {
  return (
    <div className="col-12">
      <div className="card">
        {/* <h5>My Posts</h5> */}
        <Posts posts={posts}></Posts>
      </div>
    </div>
  );
};

const RenderCreateJobPostButton = () => {
  return (
    <div className="mx-auto">
      <Link href="/app/posts/create">
        <Button className="btn btn-primary">Create Job Post</Button>
      </Link>
    </div>
  );
};

const DisplayPosts = ({ session, handleSignOut }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // get available user posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/employer/post/get-posts?uuid=${session.user.uuid}`
        );
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="h-full">
      <EmployerNavbar session={session} handleSignOut={handleSignOut} />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            {/* <h1 className='text-center'>Posts</h1> */}
            <TabView className="text-center">
              <TabPanel header="Active Jobs">
                {posts.length > 0 ? (
                  <PostPanel posts={posts} />
                ) : (
                  <div className="h-24rem p-6">
                    <EmptyJobPosts />
                    <RenderCreateJobPostButton />
                  </div>
                )}
              </TabPanel>
              <TabPanel header="Job History">
                <div className="h-24rem p-6">
                  <EmptyJobHistory />
                  <RenderCreateJobPostButton />
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};
