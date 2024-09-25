import React__default from 'react';
import { useAIContext } from './AIContextProvider.mjs';

function createNewConversationMessageInRoute({ previousValue, routeName, conversationId, messages, }) {
    return {
        ...previousValue,
        [routeName]: {
            ...previousValue[routeName],
            [conversationId]: messages,
        },
    };
}
function createUseAIConversation(client) {
    const useAIConversation = (routeName, input = {}) => {
        const clientRoute = client.conversations[routeName];
        const { routeToConversationsMap, setRouteToConversationsMap } = useAIContext();
        const messagesFromAIContext = input.id
            ? routeToConversationsMap[routeName]?.[input.id]
            : undefined;
        const [localMessages, setLocalMessages] = React__default.useState(messagesFromAIContext ?? []);
        const [conversation, setConversation] = React__default.useState(undefined);
        const [waitingForAIResponse, setWaitingForAIResponse] = React__default.useState(false);
        const [errorMessage, setErrorMessage] = React__default.useState();
        const [hasError, setHasError] = React__default.useState(false);
        // On hook initialization get conversation and load all messages
        React__default.useEffect(() => {
            async function initialize() {
                const { data: conversation } = input.id
                    ? await clientRoute.get({ id: input.id })
                    : await clientRoute.create();
                if (!conversation) {
                    const errorString = 'No conversation found';
                    setHasError(true);
                    setErrorMessage(errorString);
                    throw new Error(errorString);
                }
                const { data: messages } = await conversation.listMessages();
                setLocalMessages(messages);
                setConversation(conversation);
                setRouteToConversationsMap((previousValue) => {
                    return createNewConversationMessageInRoute({
                        previousValue,
                        routeName: routeName,
                        conversationId: conversation.id,
                        messages,
                    });
                });
            }
            initialize();
        }, [clientRoute, input.id, routeName, setRouteToConversationsMap]);
        // Update messages to match what is in AIContext if they aren't equal
        React__default.useEffect(() => {
            if (!!messagesFromAIContext && messagesFromAIContext !== localMessages)
                setLocalMessages(messagesFromAIContext);
        }, [messagesFromAIContext, localMessages]);
        const sendMessage = React__default.useCallback((input) => {
            const { content, aiContext, toolConfiguration } = input;
            conversation
                ?.sendMessage({ content, aiContext, toolConfiguration })
                .then((value) => {
                const { data: sentMessage } = value;
                if (sentMessage) {
                    setWaitingForAIResponse(true);
                    setLocalMessages((previousLocalMessages) => [
                        ...previousLocalMessages,
                        sentMessage,
                    ]);
                    setRouteToConversationsMap((previousValue) => {
                        return createNewConversationMessageInRoute({
                            previousValue,
                            routeName: routeName,
                            conversationId: conversation.id,
                            messages: [
                                ...previousValue[routeName][conversation.id],
                                sentMessage,
                            ],
                        });
                    });
                }
            })
                .catch((reason) => {
                setHasError(true);
                setErrorMessage(`error sending message ${reason}`);
            });
        }, [conversation, routeName, setRouteToConversationsMap]);
        const subscribe = React__default.useCallback((handleStoreChange) => {
            const subscription = conversation &&
                conversation.onMessage((message) => {
                    if (input.onResponse)
                        input.onResponse(message);
                    setWaitingForAIResponse(false);
                    setLocalMessages((previousLocalMessages) => [
                        ...previousLocalMessages,
                        message,
                    ]);
                    setRouteToConversationsMap((previousValue) => {
                        return createNewConversationMessageInRoute({
                            previousValue,
                            routeName: routeName,
                            conversationId: conversation.id,
                            messages: [
                                ...previousValue[routeName][conversation.id],
                                message,
                            ],
                        });
                    });
                    handleStoreChange(); // should cause a re-render
                });
            return () => {
                subscription?.unsubscribe();
            };
        }, [conversation, routeName, setRouteToConversationsMap, input]);
        const getSnapshot = React__default.useCallback(() => localMessages, [localMessages]);
        // Using useSyncExternalStore to subscribe to external data updates
        // Have to provide third optional argument in next - https://github.com/vercel/next.js/issues/54685
        const messagesFromStore = React__default.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        return [
            {
                data: { messages: messagesFromStore },
                isLoading: waitingForAIResponse,
                message: errorMessage,
                hasError,
            },
            sendMessage,
        ];
    };
    return useAIConversation;
}

export { createUseAIConversation };
