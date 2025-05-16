import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { getAllContacts } from "../../api/client/clientServices";
import Chat from "./Chat";

export interface Contact {
  id: string;
  name: string;
}

const ChatSidebar = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedUser, setSelectedUser] = useState<Contact | null>(null);

  useEffect(() => {
    if (user?._id) {
      const fetchContacts = async () => {
        try {
          const response = await getAllContacts({ userId: user._id });
          console.log(response);
          
          setContacts(response.allContacts);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };

      fetchContacts();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 border-r bg-white p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contacts</h2>
        <ul className="space-y-2">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => setSelectedUser(contact)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-blue-100 ${
                  selectedUser?.id === contact.id ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {contact.name || "Unnamed Contact"}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No contacts found</p>
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <Chat selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatSidebar;
