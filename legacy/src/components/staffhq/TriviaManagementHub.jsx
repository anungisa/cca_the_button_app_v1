import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriviaQuestion } from '@/api/entities';
import { TriviaChallenge } from '@/api/entities';
import { PlusCircle, Edit, Trash2, Brain, Users, TrendingUp, HelpCircle } from 'lucide-react';

const CreateQuestionModal = ({ onQuestionCreated }) => {
  const [formData, setFormData] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer_index: 0,
    xp_reward: 10,
    category: 'fun_facts',
    difficulty: 'medium'
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await TriviaQuestion.create(formData);
      onQuestionCreated();
      setIsOpen(false);
      setFormData({
        question_text: '', options: ['', '', '', ''], correct_answer_index: 0,
        xp_reward: 10, category: 'fun_facts', difficulty: 'medium'
      });
    } catch (error) {
      console.error('Failed to create question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({...formData, options: newOptions});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="w-4 h-4 mr-2" />Create Question</Button>
      </DialogTrigger>
      <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Trivia Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Question text"
            value={formData.question_text}
            onChange={(e) => setFormData({...formData, question_text: e.target.value})}
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Answer Options</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct_answer"
                  checked={formData.correct_answer_index === index}
                  onChange={() => setFormData({...formData, correct_answer_index: index})}
                />
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">XP Reward</label>
              <Input
                type="number"
                value={formData.xp_reward}
                onChange={(e) => setFormData({...formData, xp_reward: parseInt(e.target.value)})}
                min="1"
                max="100"
              />
            </div>
            <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="rules">Rules</SelectItem>
                <SelectItem value="current_events">Current Events</SelectItem>
                <SelectItem value="fun_facts">Fun Facts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Question'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const QuestionsTable = ({ questions, onRefresh }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Question</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Difficulty</TableHead>
        <TableHead>XP</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {questions.map(question => (
        <TableRow key={question.id}>
          <TableCell className="max-w-xs">
            <p className="truncate font-medium">{question.question_text}</p>
            <p className="text-xs text-brand-text-secondary">
              Correct: {question.options[question.correct_answer_index]}
            </p>
          </TableCell>
          <TableCell>
            <Badge variant="outline">{question.category}</Badge>
          </TableCell>
          <TableCell>
            <Badge className={
              question.difficulty === 'easy' ? 'bg-green-600' :
              question.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
            }>
              {question.difficulty}
            </Badge>
          </TableCell>
          <TableCell>{question.xp_reward} XP</TableCell>
          <TableCell>
            <Badge variant={question.is_active ? 'default' : 'secondary'}>
              {question.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function TriviaManagementHub() {
  const [questions, setQuestions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({ totalQuestions: 0, activeQuestions: 0, activeChallenges: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [questionsData, challengesData] = await Promise.all([
        TriviaQuestion.list('-created_date'),
        TriviaChallenge.list('-created_date')
      ]);
      
      setQuestions(questionsData || []);
      setChallenges(challengesData || []);
      
      setStats({
        totalQuestions: questionsData?.length || 0,
        activeQuestions: questionsData?.filter(q => q.is_active)?.length || 0,
        activeChallenges: challengesData?.filter(c => c.is_active)?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch trivia data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Trivia Management</h1>
          <p className="text-brand-text-secondary">Manage questions and challenges for FanOS trivia</p>
        </div>
        <CreateQuestionModal onQuestionCreated={fetchData} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Questions</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.totalQuestions}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active Questions</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.activeQuestions}</p>
              </div>
              <Brain className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active Challenges</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.activeChallenges}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList>
          <TabsTrigger value="questions">Questions Bank</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Trivia Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionsTable questions={questions} onRefresh={fetchData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Trivia Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary">Challenge management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}