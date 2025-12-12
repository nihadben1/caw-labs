import ProfileCard from "./components/ProfileCard";

function App() {
  return (
    <div >
      <h1>My Team</h1>

      <ProfileCard 
        name="Nihad Bentaleb"
        role="Fullstack Developer"
        email="nihad.bentaleb@univ-constantine2.dz"
      />

      <ProfileCard 
        name="Brahim Mahboub"
        role="Fullstack Developer"
        email="brahim.mahboub@univ-constantine2.dz"
      />
      <ProfileCard 
        name="Adil Chekati"
        role="Senior Lecturer"
        email="adil.chekati@univ-constantine2.dz"
      />
    </div>
    
  );
}

export default App;
