import React from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { AIChatRoom } from './components/AIChatRoom';
import { CollectionsPanel } from './components/CollectionsPanel';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QueryBuilder } from './components/QueryBuilder';
import { SaveToCollectionModal } from './components/SaveToCollectionModal';
import { MonitoringPanel } from './components/MonitoringPanel';
import { useSearch } from './hooks/useSearch';
import { useCollections } from './hooks/useCollections';
import { useAnalytics } from './hooks/useAnalytics';
import { useMonitoring } from './hooks/useMonitoring';
import { queryBuilderService } from './lib/queryBuilder';

function App() {
  const [showAIChat, setShowAIChat] = React.useState(false);
  const [showCollections, setShowCollections] = React.useState(false);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = React.useState(false);
  const [showMonitoring, setShowMonitoring] = React.useState(false);
  const [saveToCollectionModal, setSaveToCollectionModal] = React.useState<{
    isOpen: boolean;
    result: any;
  }>({ isOpen: false, result: null });
  const [queryTemplates, setQueryTemplates] = React.useState(queryBuilderService.getTemplates());
  
  const { 
    query, 
    setQuery,
    aiModeEnabled,
    results, 
    isLoading, 
    error, 
    hasSearched, 
    latency, 
    totalDocs,
    suggestions,
    realtimeSuggestions,
    isLoadingRealtimeSuggestions,
    enhancement,
    didYouMean,
    isLoadingSuggestions,
    isLoadingEnhancement,
    onSuggestionClick,
    onEnhancementUse,
    toggleAiMode,
    search, 
    clearSearch 
  } = useSearch();
  
  const collections = useCollections();
  const analytics = useAnalytics();
  const monitoring = useMonitoring();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSearch = (searchQuery: string) => {
    search(searchQuery);
  };

  const handleAIModeClick = () => {
    setShowAIChat(true);
  };

  const handleSearchFromChat = (searchQuery: string) => {
    setQuery(searchQuery);
    search(searchQuery);
    setShowAIChat(false);
  };

  const handleSaveToCollection = (result: any) => {
    setSaveToCollectionModal({ isOpen: true, result });
  };

  const handleCreateTemplate = async (name: string, description: string, filters: any[], category: string) => {
    const template = queryBuilderService.createTemplate(name, description, filters, category);
    setQueryTemplates(queryBuilderService.getTemplates());
    return template;
  };

  const handleUseTemplate = (id: string) => {
    queryBuilderService.useTemplate(id);
    setQueryTemplates(queryBuilderService.getTemplates());
  };

  const handleOpenCollections = () => setShowCollections(true);
  const handleOpenAnalytics = () => setShowAnalytics(true);
  const handleOpenQueryBuilder = () => setShowQueryBuilder(true);
  const handleOpenMonitoring = () => setShowMonitoring(true);

  const handleCloseCollections = () => setShowCollections(false);
  const handleCloseAnalytics = () => setShowAnalytics(false);
  const handleCloseQueryBuilder = () => setShowQueryBuilder(false);
  const handleCloseMonitoring = () => setShowMonitoring(false);
  const handleCloseSaveModal = () => setSaveToCollectionModal({ isOpen: false, result: null });

  const isLandingPage = !hasSearched;

  return (
    <div className="min-h-screen">
      {isLandingPage ? (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 animate-fade-in">
          <div className="max-w-4xl w-full text-center">
            <Header isCompact={false} />
            
            <div className="mt-16 mb-12">
              <SearchBar
                query={query}
                onQueryChange={handleQueryChange}
                onSearch={handleSearch}
                onClear={clearSearch}
                isLoading={isLoading}
                autoFocus={true}
                suggestions={realtimeSuggestions}
                isLoadingSuggestions={isLoadingRealtimeSuggestions}
                onSuggestionSelect={handleSearch}
                aiModeEnabled={aiModeEnabled}
                onToggleAiMode={handleAIModeClick}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="card p-6 text-center floating-element stagger-1">
                <div className="text-3xl font-bold gradient-text mb-2">Real-Time</div>
                <div className="text-sm text-white/70">Live search results</div>
              </div>
              <div className="card p-6 text-center floating-element stagger-2">
                <div className="text-3xl font-bold gradient-text mb-2">5+ Sources</div>
                <div className="text-sm text-white/70">Multiple data providers</div>
              </div>
              <div className="card p-6 text-center floating-element stagger-3">
                <div className="text-3xl font-bold gradient-text mb-2">Instant</div>
                <div className="text-sm text-white/70">Lightning fast results</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
          <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center gap-6">
                <Header isCompact={true} />
                <div className="flex-1">
                  <SearchBar
                    query={query}
                    onQueryChange={handleQueryChange}
                    onSearch={handleSearch}
                    onClear={clearSearch}
                    isLoading={isLoading}
                    suggestions={realtimeSuggestions}
                    isLoadingSuggestions={isLoadingRealtimeSuggestions}
                    onSuggestionSelect={handleSearch}
                    aiModeEnabled={aiModeEnabled}
                    onToggleAiMode={toggleAiMode}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <SearchResults
              results={results}
              query={query}
              isLoading={isLoading}
              error={error}
              latency={latency}
              totalDocs={totalDocs}
              hasSearched={hasSearched}
              suggestions={suggestions}
              enhancement={enhancement}
              didYouMean={didYouMean}
              isLoadingSuggestions={isLoadingSuggestions}
              isLoadingEnhancement={isLoadingEnhancement}
              onSuggestionClick={onSuggestionClick}
              onEnhancementUse={onEnhancementUse}
              aiModeEnabled={aiModeEnabled}
              onSaveToCollection={handleSaveToCollection}
              onOpenCollections={handleOpenCollections}
              onOpenAnalytics={handleOpenAnalytics}
              onOpenQueryBuilder={handleOpenQueryBuilder}
              onOpenMonitoring={handleOpenMonitoring}
            />
          </main>
        </div>
      )}
      
      {/* AI Chat Room */}
      <AIChatRoom
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onSearchQuery={handleSearchFromChat}
      />
      
      {/* Collections Panel */}
      <CollectionsPanel
        collections={collections.collections}
        selectedCollection={collections.selectedCollection}
        onCreateCollection={collections.createCollection}
        onSelectCollection={collections.setSelectedCollection}
        onAddToCollection={collections.addToCollection}
        onRemoveFromCollection={collections.removeFromCollection}
        onUpdateCollection={collections.updateCollection}
        onDeleteCollection={collections.deleteCollection}
        onExportCollection={collections.exportCollection}
        onSearchInCollections={collections.searchInCollections}
        isOpen={showCollections}
        onClose={handleCloseCollections}
      />
      
      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        analytics={analytics.analytics}
        isLoading={analytics.isLoading}
        onExport={analytics.exportAnalytics}
        onClear={analytics.clearAnalytics}
        isOpen={showAnalytics}
        onClose={handleCloseAnalytics}
      />
      
      {/* Query Builder */}
      <QueryBuilder
        onSearch={handleSearch}
        templates={queryTemplates}
        onCreateTemplate={handleCreateTemplate}
        onUseTemplate={handleUseTemplate}
        isOpen={showQueryBuilder}
        onClose={handleCloseQueryBuilder}
      />
      
      {/* Monitoring Panel */}
      <MonitoringPanel
        alerts={monitoring.alerts}
        notifications={monitoring.notifications}
        trends={monitoring.trends}
        onCreateAlert={monitoring.createAlert}
        onToggleAlert={monitoring.toggleAlert}
        onDeleteAlert={monitoring.deleteAlert}
        onMarkAsRead={monitoring.markNotificationAsRead}
        onMarkAllAsRead={monitoring.markAllAsRead}
        onDetectTrends={monitoring.detectTrends}
        isOpen={showMonitoring}
        onClose={handleCloseMonitoring}
      />
      
      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveToCollectionModal.isOpen}
        onClose={handleCloseSaveModal}
        result={saveToCollectionModal.result}
        collections={collections.collections}
        onSaveToCollection={collections.addToCollection}
        onCreateCollection={collections.createCollection}
      />
    </div>
  );
}

export default App;