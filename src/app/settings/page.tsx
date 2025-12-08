"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLLMSettingsService } from "@/lib/llm-settings";
import { PROVIDER_CAPABILITIES, type LLMProvider, type TaskType, type LLMSettings } from "@/lib/llm-types";
import { Check, X, Settings as SettingsIcon, Zap, DollarSign, Clock, Key } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<LLMSettings | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const service = getLLMSettingsService();
    setSettings(service.getSettings());
  }, []);

  const handleProviderToggle = (provider: LLMProvider, enabled: boolean) => {
    const service = getLLMSettingsService();
    const config = service.getProviderConfig(provider);

    service.setProviderConfig(provider, {
      ...config,
      enabled,
    });

    setSettings(service.getSettings());
  };

  const handleApiKeyChange = (provider: LLMProvider, apiKey: string) => {
    const service = getLLMSettingsService();
    const config = service.getProviderConfig(provider);

    service.setProviderConfig(provider, {
      ...config,
      apiKey,
      enabled: apiKey.length > 0, // Auto-enable when API key is entered
    });

    setSettings(service.getSettings());
  };

  const handleModelChange = (provider: LLMProvider, modelName: string) => {
    const service = getLLMSettingsService();
    const config = service.getProviderConfig(provider);

    service.setProviderConfig(provider, {
      ...config,
      modelName,
    });

    setSettings(service.getSettings());
  };

  const handleRoutingChange = (taskType: TaskType, provider: LLMProvider) => {
    const service = getLLMSettingsService();
    service.setRouting(taskType, provider);
    setSettings(service.getSettings());
  };

  const testProvider = async (provider: LLMProvider) => {
    setIsTesting({ ...isTesting, [provider]: true });

    try {
      const { getLLMRouter } = await import("@/lib/llm-router");
      const router = getLLMRouter();

      const response = await router.generate({
        prompt: "Say 'Hello! I am working correctly.' in exactly those words.",
        taskType: "fast-inference",
        maxTokens: 50,
      });

      setTestResults({
        ...testResults,
        [provider]: {
          success: true,
          message: `✓ ${response.provider} (${response.model}) responded in ${response.latencyMs}ms`,
        },
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        [provider]: {
          success: false,
          message: error instanceof Error ? error.message : "Test failed",
        },
      });
    } finally {
      setIsTesting({ ...isTesting, [provider]: false });
    }
  };

  if (!settings) {
    return <div className="container mx-auto p-8">Loading settings...</div>;
  }

  const enabledProviders = Object.entries(settings.providers)
    .filter(([_, config]) => config?.enabled && config.apiKey)
    .map(([provider]) => provider as LLMProvider);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          LLM Router Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure multiple AI providers and automatic routing for optimal performance
        </p>
      </div>

      {enabledProviders.length === 0 && (
        <Alert className="mb-6">
          <Key className="w-4 h-4" />
          <AlertDescription>
            No AI providers configured. Please add at least one API key below to enable the AI assistant.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="providers">API Providers</TabsTrigger>
          <TabsTrigger value="routing">Task Routing</TabsTrigger>
        </TabsList>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          {Object.entries(PROVIDER_CAPABILITIES).map(([provider, capabilities]) => {
            const config = settings.providers[provider as LLMProvider];
            const isEnabled = config?.enabled && config.apiKey;

            return (
              <Card key={provider}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {capabilities.displayName}
                        {isEnabled && <Badge variant="default">Active</Badge>}
                        <Badge variant="outline" className="ml-auto">
                          <Clock className="w-3 h-3 mr-1" />
                          {capabilities.avgLatency}
                        </Badge>
                        <Badge variant="outline">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${capabilities.costPerMillion}/M tokens
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Best for: {capabilities.strengths.join(", ")}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={config?.enabled || false}
                      onCheckedChange={(enabled) => handleProviderToggle(provider as LLMProvider, enabled)}
                      disabled={!config?.apiKey}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${provider}-key`}>API Key</Label>
                    <Input
                      id={`${provider}-key`}
                      type="password"
                      placeholder={`Enter your ${capabilities.displayName} API key`}
                      value={config?.apiKey || ""}
                      onChange={(e) => handleApiKeyChange(provider as LLMProvider, e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${provider}-model`}>Model</Label>
                    <Input
                      id={`${provider}-model`}
                      placeholder={capabilities.defaultModel}
                      value={config?.modelName || capabilities.defaultModel}
                      onChange={(e) => handleModelChange(provider as LLMProvider, e.target.value)}
                    />
                  </div>

                  {testResults[provider] && (
                    <Alert variant={testResults[provider].success ? "default" : "destructive"}>
                      <AlertDescription className="flex items-center gap-2">
                        {testResults[provider].success ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        {testResults[provider].message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={() => testProvider(provider as LLMProvider)}
                    disabled={!isEnabled || isTesting[provider]}
                    variant="outline"
                    className="w-full"
                  >
                    {isTesting[provider] ? "Testing..." : "Test Connection"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Routing Tab */}
        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task-Based Routing</CardTitle>
              <CardDescription>
                Assign specific AI providers to different task types for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.routing).map(([taskType, assignedProvider]) => (
                <div key={taskType} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label className="font-medium capitalize">
                      {taskType.replace(/-/g, " ")}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getTaskDescription(taskType as TaskType)}
                    </p>
                  </div>
                  <Select
                    value={assignedProvider}
                    onValueChange={(value) =>
                      handleRoutingChange(taskType as TaskType, value as LLMProvider)
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {enabledProviders.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No providers enabled
                        </SelectItem>
                      ) : (
                        enabledProviders.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            <div className="flex items-center gap-2">
                              {PROVIDER_CAPABILITIES[provider].displayName}
                              {PROVIDER_CAPABILITIES[provider].strengths.includes(taskType as TaskType) && (
                                <Zap className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Tip:</strong> Icons with ⚡ indicate the provider's strength for that task type. For best performance, match tasks to provider strengths.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getTaskDescription(taskType: TaskType): string {
  const descriptions: Record<TaskType, string> = {
    "socratic-questioning": "Deep reasoning with guided questions to help students discover insights",
    "fast-inference": "Quick responses for simple questions and real-time interactions",
    "explanation": "Detailed explanations of complex concepts",
    "reflection-feedback": "Evaluating student reflections and providing constructive feedback",
    "concept-generation": "Creating new learning content and examples",
  };
  return descriptions[taskType] || "";
}
