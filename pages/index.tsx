import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Text,
  Stack,
  StackDivider,
  Container,
  Heading,
  Button,
  HStack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const Home = () => {
  const API_BASE_URL = "http://localhost:3004/posts";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostTitle, setEditedPostTitle] = useState("");
  const [editedPostAuthor, setEditedPostAuthor] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post(API_BASE_URL, {
        title: newPostTitle,
        author: newPostAuthor,
      });
      setPosts([...posts, response.data]);
      setNewPostTitle("");
      setNewPostAuthor("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (id, title, author) => {
    setEditingPostId(id);
    setEditedPostTitle(title);
    setEditedPostAuthor(author);
    onOpen();
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditedPostTitle("");
    setEditedPostAuthor("");
    onClose();
  };

  const updatePost = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        title: editedPostTitle,
        author: editedPostAuthor,
      });
      const updatedPosts = posts.map((post) =>
        post.id === id ? response.data : post
      );
      setPosts(updatedPosts);
      setEditingPostId(null);
      setEditedPostTitle("");
      setEditedPostAuthor("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container
        maxW="container.sm"
        bg="gray.100"
        marginTop={100}
        padding={5}
        rounded={6}
      >
        <Heading mb={6} textAlign="center">
          Test Data
        </Heading>

        <Button colorScheme="blue" mb={3} onClick={onOpen}>
          Create
        </Button>

        {posts.map((post) => (
          <Card mb={3} key={post.id}>
            <CardBody>
              <Text>ID: {post.id}</Text>
              <Text>Title: {post.title}</Text>
              <Text>Author: {post.author}</Text>
              <HStack spacing="24px" mt={4}>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="teal"
                  onClick={() => startEditing(post.id, post.title, post.author)}
                >
                  Edit
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </Container>

      <Modal isOpen={isOpen} onClose={cancelEditing}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingPostId ? "Edit Data" : "Create Data"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                value={editingPostId ? editedPostTitle : newPostTitle}
                onChange={(e) => {
                  if (editingPostId) {
                    setEditedPostTitle(e.target.value);
                  } else {
                    setNewPostTitle(e.target.value);
                  }
                }}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Author</FormLabel>
              <Input
                placeholder="Author"
                value={editingPostId ? editedPostAuthor : newPostAuthor}
                onChange={(e) => {
                  if (editingPostId) {
                    setEditedPostAuthor(e.target.value);
                  } else {
                    setNewPostAuthor(e.target.value);
                  }
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={
                editingPostId ? () => updatePost(editingPostId) : createPost
              }
            >
              {editingPostId ? "Update" : "Save"}
            </Button>
            <Button onClick={cancelEditing}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
