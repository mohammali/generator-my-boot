package <%= packageSignature %>

import io.zonky.test.db.AutoConfigureEmbeddedDatabase
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@AutoConfigureEmbeddedDatabase
@SpringBootTest
class ApplicationTest {

    @Test
    fun contextLoads() {

    }
}
