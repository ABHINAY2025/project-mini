
import Logo from "../assets/Logo.jpeg"

const NavBar = () => {
  return (
    <div className="flex items-center p-2 border-2 w-full">
      <div className="flex w-14  justify-center  cursor-pointer"><img className="rounded-lg" src={Logo} alt="logo" /></div>
      <div className=" text-3xl w-full flex justify-center items-center ">
      <h1 className=" font-semibold italic tracking-wider ">Bhasha pul</h1>
      </div>
    </div>
  );
};

export default NavBar;
