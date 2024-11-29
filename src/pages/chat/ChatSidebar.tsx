import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

type Contact = {
  id: string;
  name: string;
};

type SidebarProps = {
  contacts: Contact[];
  activeChat: Contact | null;
  setActiveChat: (contact: Contact) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ contacts, activeChat, setActiveChat }) => {
  const { user } = useSelector((state: RootState) => state.user); 

  return (
    <div className="w-1/4 bg-white border-r">
      <div className="p-4 font-semibold bg-gray-200">Contacts</div>
      <ul className="p-4 space-y-4">
        {contacts
          .filter((contact) => contact.id !== user?._id) 
          .map((contact) => (
            <li
              key={contact.id}
              onClick={() => setActiveChat(contact)}
              className={`p-3 cursor-pointer ${
                activeChat?.id === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <div>{contact.name}</div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
