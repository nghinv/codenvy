/*
 * CODENVY CONFIDENTIAL
 * __________________
 *
 *  [2012] - [2014] Codenvy, S.A.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Codenvy S.A. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Codenvy S.A.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Codenvy S.A..
 */
package com.codenvy.im.command;

import com.codenvy.im.agent.AgentException;
import com.codenvy.im.agent.SecureShellAgent;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.testng.Assert.assertEquals;

/**
 * @author Dmytro Nochevnov
 */
public class SimpleCommandTest {

    @Mock
    private SecureShellAgent mockAgent;

    @BeforeTest
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCommand() throws Exception {
        doReturn("test").when(mockAgent).execute("ls");

        Command command = new SimpleCommand("ls", mockAgent, "test description");

        assertEquals(command.execute(), "test");
    }

    @Test
    public void testCommandToString() {
        Command command = new SimpleCommand("ls", null, "test description");
        assertEquals(command.toString(), "ls");
    }

    @Test
    public void testGetDescription() throws Exception {
        Command command = new SimpleCommand("ls", null, "test description");
        assertEquals(command.getDescription(), "test description");
    }

    @Test(expectedExceptions = CommandException.class, expectedExceptionsMessageRegExp = "Remote command execution fail. Error: agent error")
    public void testCommandException() throws Exception {
        doThrow(new AgentException("agent error")).when(mockAgent).execute("ls");

        Command command = new SimpleCommand("ls", mockAgent, "test description");
        command.execute();
    }
}
