'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  X, 
  Info,
  Phone,
  Settings,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';
import Dashboard from '@/components/templates/dashboard';
import phoneNumbersService, { 
  PhoneNumber, 
  PhoneNumberAssignment, 
  PhoneNumberAssignmentFilters 
} from '@/services/phone-numbers.service';
import { useRouter } from 'next/navigation';

export default function PhoneNumbersPage() {
  const [assignments, setAssignments] = useState<PhoneNumberAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const fetchAssignments = async (filters: PhoneNumberAssignmentFilters = {}) => {
    try {
      setIsLoading(true);
      const response = await phoneNumbersService.getPhoneNumberAssignments({
        page: filters.page || currentPage,
        limit: itemsPerPage,
        phone_number: filters.phone_number || searchTerm || undefined,
        ...filters
      });
      
      setAssignments(response.data);
      setTotalItems(response.pagination.totalItems);
      setTotalPages(response.pagination.totalPages);
      setCurrentPage(response.pagination.currentPage);
    } catch (error) {
      console.error('Error fetching phone number assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load phone number assignments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch();
      } else if (searchTerm === '' && currentPage === 1) {
        // If search is cleared and we're on first page, refresh data
        fetchAssignments();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search is empty, load all data
      setCurrentPage(1);
      await fetchAssignments({ page: 1 });
      return;
    }

    setIsSearching(true);
    setCurrentPage(1); // Reset to first page when searching
    try {
      await fetchAssignments({ 
        page: 1, 
        phone_number: searchTerm.trim() 
      });
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: 'Error',
        description: 'Failed to search phone numbers',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchAssignments({ page: 1 });
  };

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    
    setIsLoadingMore(true);
    try {
      await fetchAssignments({ 
        page, 
        phone_number: searchTerm 
      });
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Opening filter modal');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssignments(assignments.map(assignment => assignment._id));
    } else {
      setSelectedAssignments([]);
    }
  };

  const handleSelectAssignment = (assignmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignments(prev => [...prev, assignmentId]);
    } else {
      setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
    }
  };

  const handleAction = async () => {
    if (!selectedAction) {
      toast({
        title: 'Warning',
        description: 'Please select an action first',
        variant: 'destructive',
      });
      return;
    }

    if (selectedAssignments.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select at least one phone number assignment',
        variant: 'destructive',
      });
      return;
    }

    setIsPerformingAction(true);
    try {
      switch (selectedAction) {
        case 'deactivate':
          // Implement deactivate functionality
          toast({
            title: 'Info',
            description: 'Deactivate functionality to be implemented',
          });
          break;
        case 'reactivate':
          // Implement reactivate functionality
          toast({
            title: 'Info',
            description: 'Reactivate functionality to be implemented',
          });
          break;
        case 'delete':
          // Implement delete functionality
          toast({
            title: 'Info',
            description: 'Delete functionality to be implemented',
          });
          break;
        default:
          toast({
            title: 'Error',
            description: 'Unknown action selected',
            variant: 'destructive',
          });
      }
      
      // Refresh the data
      await fetchAssignments();
      setSelectedAssignments([]);
      setSelectedAction('');
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive',
      });
    } finally {
      setIsPerformingAction(false);
    }
  };

  const inactiveAssignments = assignments?.filter(assignment => !assignment.active);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Dashboard
          header={{
            title: "Your Numbers",
            subtitle: {
              text: "Manage your phone number assignments",
            },
          }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </Dashboard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Your Numbers",
          subtitle: {
            text: "Manage your phone number assignments",
          },
          children: (
            <Button 
              onClick={() => router.push('/phone-numbers/buy')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy Number
            </Button>
          ),
        }}
      >
        <div className="p-6 h-full overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Alert Banner */}
            {showAlert && inactiveAssignments.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50 rounded-lg">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  You have {inactiveAssignments.length} inactive phone number assignment(s). 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-orange-800 underline ml-2"
                    onClick={() => setShowAlert(false)}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Search and Filter Bar */}
            <Card className="border-0 shadow-sm bg-white rounded-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search phone numbers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500 h-11 rounded-lg"
                        disabled={isSearching}
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                          disabled={isSearching}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching || !searchTerm.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-11 rounded-lg font-medium"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                    {/* <Button
                      variant="outline"
                      onClick={handleFilter}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-11 px-4 rounded-lg font-medium"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button> */}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      {searchTerm ? (
                        <>
                          Found {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchTerm}"
                        </>
                      ) : (
                        <>
                          {assignments.length} of {totalItems} assignments
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedAssignments.length > 0 && (
              <Card className="border-0 shadow-sm bg-white rounded-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 font-medium">
                        {selectedAssignments.length} assignment(s) selected
                      </span>
                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger className="w-48 border-gray-300 rounded-lg h-10">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deactivate">Deactivate</SelectItem>
                          <SelectItem value="reactivate">Reactivate</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAction}
                        disabled={!selectedAction || isPerformingAction}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-10 rounded-lg font-medium"
                      >
                        {isPerformingAction ? 'Processing...' : 'Apply'}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAssignments([])}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4 rounded-lg font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phone Numbers Table */}
            <Card className="border-0 shadow-sm bg-white rounded-lg">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Phone Number Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-6 font-medium text-gray-700">
                          {/* <Checkbox
                            checked={selectedAssignments.length === assignments.length && assignments.length > 0}
                            onCheckedChange={handleSelectAll}
                            className="border-gray-300"
                          /> */}
                          S.No.
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Phone Number</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Active</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700">Assigned Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment,index) => (
                        <tr key={assignment._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            {/* <Checkbox
                              checked={selectedAssignments.includes(assignment._id)}
                              onCheckedChange={(checked) => handleSelectAssignment(assignment._id, checked as boolean)}
                              className="border-gray-300"
                            /> */}
                            {index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900 text-base">{assignment.phone_number}</div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge 
                              variant={assignment.active ? 'default' : 'secondary'}
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                assignment.active 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              {assignment.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-900 text-sm">
                              {new Date(assignment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {assignments.length === 0 && (
                  <div className="text-center py-16">
                    <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm ? 'No phone numbers found' : 'No phone number assignments found'}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {searchTerm 
                        ? `No phone numbers match "${searchTerm}". Try adjusting your search terms.`
                        : 'Get started by purchasing your first phone number.'
                      }
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={() => router.push('/phone-numbers/buy')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Buy Number
                      </Button>
                    )}
                    {searchTerm && (
                      <Button 
                        onClick={handleClearSearch}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-6 border-t border-gray-100 bg-gray-50">
                    <div className="text-sm text-gray-600 font-medium">
                      Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoadingMore}
                        className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            disabled={isLoadingMore}
                            className={`w-8 h-8 p-0 rounded-lg ${
                              currentPage === page 
                                ? 'bg-green-600 text-white border-green-600' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoadingMore}
                        className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 