DROP POLICY IF EXISTS "Users can subscribe to own realtime topics" ON realtime.messages;
CREATE POLICY "Users can subscribe to own realtime topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() ~ ('^(notifications|subscriptions):' || (SELECT auth.uid()::text) || ':[A-Za-z0-9]+$')
);