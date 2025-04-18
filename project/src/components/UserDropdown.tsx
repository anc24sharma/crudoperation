import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, ChevronDown } from 'lucide-react';

interface User {
  id: number;
  name: string;
  domain: string;
  github: string;
  linkedin: string;
}

const UserDropdown: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://newsapi-eosin.vercel.app/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        setDisplayCount((prev) => Math.min(prev + 5, users.length));
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
      >
        <span>Team Members</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto"
        >
          {users.slice(0, displayCount).map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.domain}</p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;