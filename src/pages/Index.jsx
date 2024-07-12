import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

const fetchTopStories = async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  
  const storyPromises = top100Ids.map(id =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  );
  
  return Promise.all(storyPromises);
};

const StoryItem = ({ story }) => (
  <li className="mb-4 p-4 border rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-2">
      <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {story.title}
      </a>
    </h2>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Upvotes: {story.score}</span>
      <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
        Read more
      </a>
    </div>
  </li>
);

const SkeletonStory = () => (
  <li className="mb-4 p-4 border rounded-lg shadow-sm">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  </li>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Hacker News Top Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </header>

      {error && <p className="text-red-500">Error fetching stories: {error.message}</p>}

      <ul>
        {isLoading
          ? Array(10).fill().map((_, index) => <SkeletonStory key={index} />)
          : filteredStories?.map(story => <StoryItem key={story.id} story={story} />)
        }
      </ul>
    </div>
  );
};

export default Index;