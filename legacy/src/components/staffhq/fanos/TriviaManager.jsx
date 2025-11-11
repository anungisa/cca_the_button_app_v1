import React, { useState, useEffect } from 'react';
import { TriviaChallenge, TriviaQuestion } from '@/api/entities'; // Assuming combined entity
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Brain, Loader2 } from 'lucide-react';

const EditTriviaQuestionModal = ({ question, onSave, onClose }) => {
  const [formData, setFormData] = useState(question || {
    question_text: '',
    options: ['', '', '', ''],
    correct_answer_index: 0,
    difficulty: 'medium',
    category: 'fun_facts'
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit' : 'Add'} Trivia Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Question Text"
            value={formData.question_text}
            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          />
          {formData.options.map((option, index) => (
            <Input
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...formData.options];
                newOptions[index] = e.target.value;
                setFormData({ ...formData, options: newOptions });
              }}
            />
          ))}
          <Select
            value={formData.correct_answer_index.toString()}
            onValueChange={(value) => setFormData({ ...formData, correct_answer_index: parseInt(value) })}
          >
            <SelectTrigger><SelectValue placeholder="Correct Answer" /></SelectTrigger>
            <SelectContent>
              {formData.options.map((option, index) => (
                <SelectItem key={index} value={index.toString()}>{`Option ${index + 1}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-4">
            <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
              <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="rules">Rules</SelectItem>
                <SelectItem value="current_events">Current Events</SelectItem>
                <SelectItem value="fun_facts">Fun Facts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave}>Save Question</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function TriviaManager() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      // In a real app, TriviaQuestion would be its own entity
      const fetchedQuestions = await TriviaQuestion.list();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error loading trivia questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestion = async (questionData) => {
    if (editingQuestion) {
      await TriviaQuestion.update(editingQuestion.id, questionData);
    } else {
      await TriviaQuestion.create(questionData);
    }
    loadQuestions();
  };

  const handleDeleteQuestion = async (questionId) => {
    await TriviaQuestion.delete(questionId);
    loadQuestions();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" /> Trivia Question Bank</CardTitle>
          <Button onClick={() => { setEditingQuestion(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="max-w-md truncate">{q.question_text}</TableCell>
                <TableCell>{q.category}</TableCell>
                <TableCell>{q.difficulty}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingQuestion(q); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpen && (
          <EditTriviaQuestionModal
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}