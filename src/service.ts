// an example of implementation of the operations in the openapi specification

function getRoot() {
  return {
    name: 'Kitty the cat',
    photoUrls: [
      'https://en.wikipedia.org/wiki/Cat#/media/File:Kittyply_edit1.jpg',
    ],
    status: 'available',
  };
}

function getRoot2() {}

export default {
  getRoot,
  getRoot2,
};
